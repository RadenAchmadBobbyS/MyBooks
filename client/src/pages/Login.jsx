import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../helpers/http";

export default function Login() {
    const navigate = useNavigate();

  async function handleCredentialResponse(response) {
        console.log("Encoded JWT ID token: " + response.credential);
        try {
          const { data } = await http({
              method: "POST",
              url: "/google-login",
              data: {
                tokenId: response.credential
              },
          });
          console.log(data, '<<<<<')
          localStorage.setItem("token", data.token)
          localStorage.setItem("name", data.user.name)
          localStorage.setItem("id", data.user.id)
          localStorage.setItem("role", data.user.role)

          navigate('/')
        } catch (error) {
          console.log(error)
        }
      }

      useEffect(() => {
    
        google.accounts.id.initialize({
          client_id: "564270612557-q1i61513u57n5nja8ddbe8pspphis88j.apps.googleusercontent.com",
          callback: handleCredentialResponse
        });
    
        google.accounts.id.renderButton(
          document.getElementById("google-btn"),
          { theme: "outline", size: "large" }
        );
    
      }, []);

      const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                navigate("/")
            };

        } catch (error) {
            console.log("Failed to fetch user:", error);
        }
    };

      useEffect(() => {
        fetchUser();
      }, [])


    return (
        <>
        <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
                <div className="bg-white shadow-lg p-8 rounded-md max-w-md w-full">
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold">Hello Books Lovers</h2>
                    <p className="text-gray-500 text-sm text-center mt-2">
                        Masukan email & password
                    </p>
                </div>

                <form className="mt-6 space-y-4 text-black" >
                    <div className="text-white">
                        <label className="block text-sm font-medium text-gray-700">Email *</label>
                        <input type="email" className="input input-bordered w-full" placeholder="Example: jongkeng@mail.com"/>
                    </div>
                    <div className="text-white">
                        <label className="block text-sm font-medium text-gray-700">Password *</label>
                        <input type="password" className="input input-bordered w-full mt-1" placeholder="Enter your password"/>
                    </div>
                    <button className="btn btn-neutral" type="submit">Login</button>
                    <Link to="/" className="btn btn-ghost pb-3 pl-5 bg-white hover:text-black border-0">aku tidak jadi login.</Link>
                    <div id="google-btn"></div>
                </form>
            </div>
            </div>
        </>
    )
}