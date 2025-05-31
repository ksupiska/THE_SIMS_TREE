import React from "react";

interface Character {
    name: string;
    surname: string;
    city: string;
    type: string;
    kind: string;
    avatar: string;
}

interface Props {
    character: Character;
    onClose: () => void;
}


export const CharacterCardModal: React.FC<Props> = ({ character, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    ×
                </button>

                <div className="modal-content">
                    <img
                        src={character.avatar || "/placeholder.svg?height=80&width=80"}
                        alt={`${character.name} ${character.surname}`}
                        className="avatar"
                    />

                    <h2 className="name">
                        {character.name} {character.surname}
                    </h2>

                    <div className="details">
                        <div className="detail-row">
                            <span className="detail-label">Город:</span>
                            <span className="detail-value">{character.city}</span>
                        </div>

                        <div className="detail-row">
                            <span className="detail-label">Тип:</span>
                            <span className="detail-value">{character.type}</span>
                        </div>

                        <div className="detail-row">
                            <span className="detail-label">Черты:</span>
                            <span className="detail-value">{character.kind}</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-container {
          background-color: white;
          border-radius: 8px;
          width: 320px;
          position: relative;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .close-button {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          font-size: 24px;
          line-height: 1;
          cursor: pointer;
          color: #888;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .close-button:hover {
          color: #333;
        }
        
        .modal-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 16px;
        }
        
        .name {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 24px 0;
          color: #333;
          text-align: center;
        }
        
        .details {
          width: 100%;
          border-top: 1px solid #eee;
          padding-top: 16px;
        }
        
        .detail-row {
          display: flex;
          margin-bottom: 12px;
          font-size: 14px;
        }
        
        .detail-row:last-child {
          margin-bottom: 0;
        }
        
        .detail-label {
          width: 70px;
          color: #666;
          font-weight: 500;
        }
        
        .detail-value {
          flex: 1;
          color: #333;
        }
      `}</style>
        </div>
    )
}
