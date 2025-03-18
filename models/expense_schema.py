from pydantic import BaseModel, Field

class ExpenseSchema(BaseModel):
    concepto: str = Field(..., min_length=3, max_length=100)
    cantidad: float = Field(..., gt=0)
    categoria: str = Field(None, max_length=50)
