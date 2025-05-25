import React from "react";
import { Button } from "react-bootstrap";
import { CharacterType } from "./Tree.types";
import { styles } from "./Tree.Styles";

interface CharacterModalProps {
  show: boolean;
  characters: CharacterType[];
  onSelectCharacter: (character: CharacterType) => void;
  onCreateNewCharacter: () => void;
  onClose: () => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  show,
  characters,
  onSelectCharacter,
  onCreateNewCharacter,
  onClose,
}) => {
  if (!show) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h3 style={{ textAlign: "center", marginBottom: "16px" }}>Выберите персонажа</h3>

        <div style={styles.characterGrid}>
          {characters.map(character => (
            <div
              key={character.id}
              style={styles.characterItem}
              onClick={() => onSelectCharacter(character)}
              onMouseEnter={e =>
                (e.currentTarget.style.borderColor = "#2196f3")
              }
              onMouseLeave={e =>
                (e.currentTarget.style.borderColor = "transparent")
              }
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