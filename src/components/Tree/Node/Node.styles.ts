import { CSSProperties } from "react";

export const nodeStyles = {
    node: {
        position: "absolute",
        width: "100px",
        height: "100px",
        backgroundColor: "#fff",
        borderRadius: "50%",
        border: "2px solid #999",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        userSelect: "none",
        cursor: "pointer",
        zIndex: 1,
    } as CSSProperties,
};

export const getControlButtonStyle = (isHovered: boolean, color: string): CSSProperties => ({
    backgroundColor: isHovered ? color : "#e3e3e3",
    transition: "background-color 0.3s ease",
    position: "absolute",
    border: "1px solid #ccc",
    borderRadius: "100px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
    zIndex: 10,
});