import AuthWrapper from "./AuthWrapper"

const Auth = () => {
    return (
        <div>
            <div>
                <h1 className="fw-bold display-4 py-5 py-md-7 d-flex justify-content-center" style={{ color: "#4a8d56" }}>Добро пожаловать</h1>
            </div>
            <AuthWrapper />
        </div>
    )
}

export default Auth
