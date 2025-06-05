import { useState } from "react";
import { supabase } from "../../SupabaseClient";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import "../../css/loginform.css";

const RequestResetPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");

    const handleResetPassword = async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "https://the-sims-tree.vercel.app/update-password",
        });

        if (error) {
            setMessage("Ошибка: " + error.message);
            setMessageType("error");
        } else {
            setMessage("Письмо для сброса пароля отправлено!");
            setMessageType("success");
        }
    };

    return (
        <div className="sims-auth-container">
            <div className="sims-auth-card">
                <div className="sims-auth-header">
                    <h2>Сброс пароля</h2>
                </div>

                <div className="sims-auth-form">
                    <div className="sims-form-group">
                        <div className="sims-input-icon">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            placeholder="Введите вашу почту"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="sims-form-input"
                        />
                    </div>

                    <button
                        className="sims-button sims-button-primary"
                        onClick={handleResetPassword}
                    >
                        Отправить ссылку
                    </button>

                    {message && (
                        <div
                            className={`sims-message ${messageType === "success"
                                    ? "sims-message-success"
                                    : "sims-message-error"
                                }`}
                        >
                            {messageType === "success" ? (
                                <CheckCircle size={18} />
                            ) : (
                                <AlertCircle size={18} />
                            )}
                            <p>{message}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestResetPassword;
