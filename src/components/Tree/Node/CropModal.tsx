
import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../../utils/cropImage";
import { Area } from 'react-easy-crop';
import { Modal } from "react-bootstrap";

type Props = {
    imageSrc: string;
    onClose: () => void;
    onCropComplete: (croppedImage: File) => void;
};

export const CropModal: React.FC<Props> = ({ imageSrc, onClose, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const handleCropComplete = useCallback(
        (_: Area, croppedAreaPixels: Area) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

    const handleDone = async () => {
        if (!croppedAreaPixels) {
            // Если нет данных о кропе — можно просто закрыть модалку или показать предупреждение
            console.warn("Область кропа не выбрана");
            return;
        }

        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedImage) {
                onCropComplete(croppedImage);
            }
        } catch (error) {
            console.error("Ошибка при обрезке изображения:", error);
        }

        onClose();
    };

    return (
        <Modal show onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Редактировать аватар</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ position: "relative", height: 400 }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                />
            </Modal.Body>
            <Modal.Footer>
                <button onClick={onClose}>Отмена</button>
                <button onClick={handleDone}>Сохранить</button>
            </Modal.Footer>
        </Modal>
    );
};
