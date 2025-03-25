import { useEffect } from "react";
import { useNavigate } from "react-router";
import http from "../helpers/http";

export default function Login() {
    const navigate = useNavigate();

  async  function handleCredentialResponse(response) {
        console.log("Encoded JWT ID token: " + response.credential);
        try {
          const { data } = await http({
              method: "POST",
              url: "/google-login",
              data: {
                tokenId: response.credential
              },
          });
          console.log(data)

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
          { theme: "outline", size: "large" }  // customization attributes
        );
    
        // google.accounts.id.prompt(); // also display the One Tap dialog
    
      }, []);


    return (
        <>
        <div id="google-btn"></div>
        </>
    )
}