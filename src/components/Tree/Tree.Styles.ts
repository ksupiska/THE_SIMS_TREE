import { CSSProperties } from "react";

export const styles = {
  canvas: {
    width: "100%",
    height: "100vh",
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
    position: "relative",
    touchAction: "none",
  } as CSSProperties,

  inner: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100000px",
    height: "100000px",
    transformOrigin: "top left",
    transition: "transform 0.1s ease-out",
  } as CSSProperties,

  modalOverlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "24px",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
  },
  characterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: "16px",
    marginTop: "16px",
  },
  characterItem: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: "12px",
    padding: "10px",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    border: "1px solid transparent",
  },
  characterItemHover: {
    borderColor: "#2196f3",
    backgroundColor: "#e3f2fd",
  },
  characterAvatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    objectFit: "cover" as const,
    marginBottom: "8px",
  },

  relationshipButton: {
    padding: "10px 16px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.2s",
    textAlign: "center" as const,
  },
  relationshipButtonHover: {
    backgroundColor: "#e0f7fa",
    borderColor: "#00acc1",
  },
};
