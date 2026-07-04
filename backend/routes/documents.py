from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from database.models import Document
from database.config import get_db
from backend.routes.auth import get_current_user

router = APIRouter(prefix="/api/documents")

class DocumentResponse(BaseModel):
    id: UUID
    filename: str
    status: str
    chunk_count: int
    created_at: datetime

@router.post("/upload", operation_id="uploadDocument", status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Upload a document and process it.
    """
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File must have a name.")
    
    try:
        # Placeholder for document processing logic
        document = Document(
            user_id=current_user.id,
            filename=file.filename,
            status="processing",
            chunk_count=0,
            created_at=datetime.utcnow(),
        )
        db.add(document)
        db.commit()
        db.refresh(document)
        return {"id": document.id, "message": "Document uploaded successfully."}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/", operation_id="listDocuments", response_model=List[DocumentResponse])
def list_documents(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    List all documents uploaded by the current user.
    """
    documents = db.query(Document).filter(Document.user_id == current_user.id).all()
    return [
        DocumentResponse(
            id=doc.id,
            filename=doc.filename,
            status=doc.status,
            chunk_count=doc.chunk_count,
            created_at=doc.created_at,
        )
        for doc in documents
    ]

@router.delete("/{id}", operation_id="deleteDocument", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Delete a document by ID.
    """
    document = db.query(Document).filter(Document.id == id, Document.user_id == current_user.id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")
    
    db.delete(document)
    db.commit()