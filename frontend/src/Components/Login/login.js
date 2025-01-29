const Login = () => {

    const handleLogin = () => {
        const authToken = crypto.randomUUID();

        localStorage.setItem("authToken", authToken);
    }


    return (
        <div className="container">
            <h1>LOGIN PAGE</h1>
            <label for="username-input">Username</label>
            <input type="text" className="username-input" name="username-input" placeholder="username"></input>
            <input type="text" className="password-input" name="password-input" placeholder="password"></input>
            {/* <Link onClick={loginUser(username, password)} to="/home"></Link> */}
        </div>
    );
}

export default Login;