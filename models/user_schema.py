from pydantic import BaseModel, Field, EmailStr

class UserSchema(BaseModel):
    usuario: str = Field(..., min_length=3, max_length=40)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=50)

    class Config:
        from_attibutes = True
