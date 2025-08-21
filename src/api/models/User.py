from api.database.db import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String


class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email
        }