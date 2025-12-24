from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from app.models.user import User
from app.utils.security import get_current_user
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageResponse

router = APIRouter()


@router.get("/", response_model=List[MessageResponse])
async def get_messages(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get all messages for current user"""
    messages = (
        db.query(Message)
        .filter(
            (Message.sender_id == current_user.id)
            | (Message.receiver_id == current_user.id)
        )
        .order_by(Message.timestamp.desc())
        .all()
    )

    for msg in messages:
        msg.sender_name = msg.sender.name
        msg.receiver_name = msg.receiver.name

    return messages


@router.post("/", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send a message"""
    new_message = Message(sender_id=current_user.id, **message_data.dict())
    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    new_message.sender_name = current_user.name
    new_message.receiver_name = new_message.receiver.name
    return new_message


@router.get("/chat/{user_id}", response_model=List[MessageResponse])
async def get_chat_history(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get chat history with specific user"""
    messages = (
        db.query(Message)
        .filter(
            ((Message.sender_id == current_user.id) & (Message.receiver_id == user_id))
            | (
                (Message.sender_id == user_id)
                & (Message.receiver_id == current_user.id)
            )
        )
        .order_by(Message.timestamp.asc())
        .all()
    )

    for msg in messages:
        msg.sender_name = msg.sender.name
        msg.receiver_name = msg.receiver.name

    return messages
