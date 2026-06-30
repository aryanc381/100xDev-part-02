from pathlib import Path
import chromadb
from sentence_transformers import SentenceTransformer

KB_DIR = 'kb'
COLLECTION_NAME = 'monuments'
EMBED_MODEL = 'BAAI/bge-small'
TOP_K = 3

def load_docs():
    docs = []
    for path in Path(KB_DIR).glob("*.txt"):
        text = path.read_text(encoding="utf-8")
        docs.append({"id": path.stem, "text": text, "source": path.name})
    return docs

def chunk_doc(doc):
    paras = [p.strip() for p in doc["text"].split("\n\n") if p.strip()]
    chunks = []
    for i, para in enumerate(paras):
        chunks.append({"id": f"{doc['id']}_chunk_{i}", "text": para, "source": doc["source"]})
    return chunks

def build_store():
    client = chromadb.PersistentClient(path='./chroma_db')
    model = SentenceTransformer(EMBED_MODEL)

    all_chunks = []
    for doc in load_docs():
        all_chunks.extend(chunk_doc(doc))

    texts = [c["text"] for c in all_chunks]
    ids = [c["id"] for c in all_chunks]
    metadatas = [{"source": c["source"]} for c in all_chunks]

    collection = client.get_or_create_collection(COLLECTION_NAME)
    embeddings = model.encode(texts).tolist()
    collection.add(ids=ids, embeddings=embeddings, documents=texts, metadatas=metadatas)
    print(f"Stored {len(all_chunks)} chunks.")
    return collection, model

def retrieve(query, collection, model):
    q_emb = model.encode([query]).tolist()
    results = collection.query(query_embeddings=q_emb, n_results=TOP_K)
    return [
        {"text": results["documents"][0][i], "source": results["metadatas"][0][i]["source"]}
        for i in range(len(results["documents"][0]))
    ]

def build_prompt(query, chunks):
    context = "\n\n".join([c["text"] for c in chunks])
    return f"""You are a storyteller explaining Indian history. Answer the question using ONLY the context below.

Context:
{context}

Question: {query}

Answer:"""

if __name__ == "__main__":
    collection, model = build_store()

    while True:
        q = input("\nAsk a question (or quit): ")
        if q.lower() == "quit":
            break

        chunks = retrieve(q, collection, model)
        print(f"\n--- Retrieved {len(chunks)} chunks ---")
        for c in chunks:
            print(f"[{c['source']}] {c['text'][:150]}...")

        prompt = build_prompt(q, chunks)
        print(f"\n--- Prompt (ready for the LLM) ---\n{prompt}")
