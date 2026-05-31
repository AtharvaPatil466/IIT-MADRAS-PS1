"""One-shot: init schema + seed every dataset.

Run: python3 -m scripts.seed_all
"""

from scripts.init_db import init_db
from app.data import seed_india, seed_uk, seed_uae, seed_usa, seed_rights, seed_history, seed_locations
from app.services import rag


def main() -> None:
    print(f"DB: {init_db()}")
    seed_india.seed()
    seed_uk.seed()
    seed_uae.seed()
    seed_usa.seed()
    seed_rights.seed()
    seed_history.seed()
    seed_locations.seed()
    n = rag.ingest()
    print(f"RAG index built ({n} docs)")


if __name__ == "__main__":
    main()
