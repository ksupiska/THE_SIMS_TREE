import React from "react";
import { Button } from "react-bootstrap";
import { CharacterType, PartnerType } from "../Tree.types";
import { partnerTypes } from "../PartnerTypes";
import { styles } from "../Tree.Styles";

interface PartnerModalProps {
    show: boolean;
    characters: CharacterType[];
    selectedPartnerType: PartnerType;
    onSelectPartner: (character: CharacterType) => void;
    onCreateNewCharacter: () => void;
    onClose: () => void;
    onSelectPartnerType: (type: PartnerType) => void;
}

export const PartnerModal: React.FC<PartnerModalProps> = ({
    show,
    characters,
    selectedPartnerType,
    onSelectPartner,
    onCreateNewCharacter,
    onClose,
    onSelectPartnerType,
}) => {
    if (!show) return null;

    return (
        <div style={styles.modalOverlay} className="modal">
            <div style={styles.modal}>
                <h3 style={{ textAlign: "center", marginBottom: "16px" }}>Выберите тип связи</h3>

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    marginBottom: "16px",
                    flexWrap: "wrap"
                }}>
                    {partnerTypes.map(({ type, label, icon }) => (
                        <button
                            key={type}
                            onClick={() => onSelectPartnerType(type)}
                            style={{
                                padding: "10px 16px",
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                border: selectedPartnerType === type ? "2px solid rgb(59, 161, 0)" : "1px solid #ccc",
                                backgroundColor: selectedPartnerType === type ? "rgba(59, 161, 0, 0.1)" : "#f9f9f9",
                                color: "#333",
                                fontSize: "15px",
                                fontWeight: 500,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                transition: "all 0.2s ease-in-out",
                                cursor: "pointer",
                                minWidth: "140px",
                                justifyContent: "center",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(59, 161, 0, 0.15)")}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = selectedPartnerType === type ? "rgba(59, 161, 0, 0.1)" : "#f9f9f9")}
                        >
                            {icon} {label}
                        </button>
                    ))}
                </div>

                <h3 style={{ textAlign: "center", marginBottom: "16px" }}>Выберите партнёра</h3>
                <div style={styles.characterGrid}>
                    {characters.map(character => (
                        <div
                            key={character.id}
                            style={styles.characterItem}
                            onClick={() => onSelectPartner(character)}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgb(59, 161, 0)")}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = "transparent")}
                        >
                            <img
                                src={character.avatar}
                                alt={`${character.name} ${character.surname}`}
                                style={styles.characterAvatar}
                            />
                            <span style={{ fontSize: "14px", textAlign: "center" }}>
                                {character.name} {character.surname}
                            </span>
                        </div>
                    ))}
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", gap: "10px" }}>
                    <Button onClick={onCreateNewCharacter}>Добавить нового</Button>
                    <Button variant="secondary" onClick={onClose}>Отмена</Button>
                </div>
            </div>
        </div>
    );
};