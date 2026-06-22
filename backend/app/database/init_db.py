from app.database.connection import engine
from app.models.database_models import Base


def create_tables():
    Base.metadata.create_all(bind=engine)