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
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  } as CSSProperties,

  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    textAlign: "center",
    maxHeight: "80vh",
    overflowY: "auto",
  } as CSSProperties,

  characterItem: {
    display: "flex",
    alignItems: "center",
    padding: "8px",
    margin: "5px 0",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#f0f0f0",
    },
  } as CSSProperties,

  characterAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "10px",
    objectFit: "cover",
  } as CSSProperties,
};
