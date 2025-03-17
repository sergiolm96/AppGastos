from pydantic import BaseModel, Field, EmailStr

class UserSchema(BaseModel):
    nombre_usuario: str = Field(..., min_length=3, max_length=40)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=50)

    class Config:
        orm_mode = True
