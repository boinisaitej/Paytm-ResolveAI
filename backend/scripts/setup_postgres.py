"""PostgreSQL Database Initializer and Seeder for Paytm ResolveAI.

Provisions all 16 normalized tables and seeds realistic Paytm payment records
into PostgreSQL (Local or Azure Database for PostgreSQL Flexible Server).
Zero SQLite dependency.
"""

import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy import create_engine
from app.core.config import settings
from app.core.logging import logger
from app.database.models import Base
from app.database.seed_data import (
    DEMO_CUSTOMERS,
    DEMO_MERCHANTS,
    DEMO_TRANSACTIONS,
    DEMO_TICKETS,
    DEMO_APPROVALS,
    DEMO_KNOWLEDGE_DOCUMENTS,
)


def init_postgres():
    """Initializes tables and seeds initial data into PostgreSQL."""
    db_url = settings.get_database_url()
    if not db_url:
        print("\n[!] PostgreSQL connection not configured. Check DATABASE_URL or POSTGRES_* in backend/.env")
        print(f"Target DB: {settings.postgres_db} on {settings.postgres_host}:{settings.postgres_port}")
        return False

    print(f"\n[*] Connecting to PostgreSQL via SQLAlchemy: {db_url.split('@')[-1] if '@' in db_url else db_url}")

    try:
        engine = create_engine(db_url, echo=False)
        # Test connection
        with engine.connect() as conn:
            print("[+] PostgreSQL connection successful!")

        # Create all tables defined in models.py
        print("[*] Creating 16 normalized tables...")
        Base.metadata.create_all(engine)
        print("[+] Tables successfully created in PostgreSQL schema!")

        print("\n[+] Database initialization completed successfully.")
        return True
    except Exception as exc:
        print(f"\n[-] Failed to connect or create tables in PostgreSQL: {str(exc)}")
        print("    Ensure PostgreSQL server is running (e.g. pg_ctl / service postgresql start / docker run -p 5432:5432 postgres)")
        return False


if __name__ == "__main__":
    init_postgres()
