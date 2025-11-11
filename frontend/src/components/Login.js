import React, { useState } from "react";

function Login() {
    // 1️⃣ Create state variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const API_URL = process.env.REACT_APP_API_URL;

    // const [error, setError] = useState("");
    // const [success, setSuccess] = useState(false);
    // const [loading, setLoading] = useState(false);

    // //   // 2️⃣ Handle form submission
    // //   const handleSubmit = (e) => {
    // //     e.preventDefault(); // Stop form refresh
    // //     setError("");
    // //     setSuccess(false);

    // //     // Simple validation
    // //     if (!email || !password) {
    // //       setError("Please enter both email and password.");
    // //       return;
    // //     }

    //     // Simulate fake login delay
    //     setLoading(true);
    //     setTimeout(() => {
    //       setLoading(false);
    //       if (email === "sulfi@bitogrid.com" && password === "123456") {
    //         setSuccess(true);
    //       } else {
    //         setError("Invalid email or password.");
    //       }
    //     }, 1500);
    //   };


    const handleLogin = async (e) => {
        e.preventDefault();
        /*try {
            const res = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "Zulfi", // add this if using /signup route
                    email: email,
                    password: password,
                }),
            });

            const data = await res.json();
            console.log(data);
            if (res.ok) {
                setMessage("✅ Login successful!");
                console.log(data.user);
            } else {
                setMessage(`❌ Enter valid Username and Password`);
            }
        } catch (err) {
            setMessage("Server error");
        }
    };*/
    try {
        const res = await fetch(`${API_URL}/api/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });
    
        const data = await res.json();
    
        if (res.ok) {
          setMessage("✅ Login successful!");
          // Save user info in localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          // Redirect to dashboard
          window.location.href = "/dashboard";
        } else {
          setMessage(`❌ ${data.message}`);
        }
      } catch (err) {
        console.error(err);
        setMessage("Server error");
      }
    };


    return (
        <div className="relative flex justify-center items-center min-h-screen w-screen bg-cover bg-center bg-no-repeat bg-[url('https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?auto=format&fit=crop&q=80&w=1190')]">
            <div className="absolute inset-0 bg-black/60"></div>

            <div className="relative z-10 flex flex-col bg-gradient-to-b from-violet-600/80 to-white/90 p-8 rounded-2xl shadow-2xl w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 gap-6 backdrop-blur-md h-lg py-16">
                {/* Logo */}
                <div className="flex justify-center">
                    <img src="/logo-wt.svg" alt="logo" className="w-24 h-auto" />
                </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
            Welcome to Fivepluz
          </h1>
          <p className="text-white/90 text-sm sm:text-base">
            Please login to continue dev
          </p>
        </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="flex flex-col items-center gap-4 w-full">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-5/6 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-5/6 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />

                    <button
                        type="submit"
                        // disabled={loading}
                        className="w-5/6 p-3 rounded-md bg-violet-700 hover:bg-violet-800 transition text-white font-semibold shadow-md disabled:opacity-70"
                    >
                        Login
                    </button>
                </form>

                {/* Status messages */}
                {message && <p className="text-red-500 text-center">{message}</p>}
                {/* {message && <p className="text-green-500 text-center">Login successful 🎉</p>} */}

                {/* Social Login */}
                {/* <div className="text-center text-white/90">
          <p className="text-black">or continue with</p>
          <div className="flex justify-center gap-4 mt-3 flex-wrap">
            <button className="bg-white text-black rounded-xl px-4 py-2 shadow hover:bg-gray-100">
              Google
            </button>
            <button className="bg-white text-black rounded-xl px-4 py-2 shadow hover:bg-gray-100">
              Facebook
            </button>
            <button className="bg-white text-black rounded-xl px-4 py-2 shadow hover:bg-gray-100">
              Apple
            </button>
          </div>
        </div> */}
            </div>
        </div>
    );
}

export default Login;
