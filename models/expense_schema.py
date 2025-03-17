from pydantic import BaseModel, Field
from typing import Optional

class ExpenseSchema(BaseModel):
    concepto: str = Field(..., min_length=3, max_length=100)
    cantidad: float = Field(..., gt=0)
    categoria_id: Optional[str] = Field(None, max_length=50)
