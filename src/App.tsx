import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { Auth, Hub } from "aws-amplify";
import { useEffect, useState } from "react";

const App = () => {
  const [user, setUser] = useState(null);
  const [customState, setCustomState] = useState(null);

  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      console.log({ event });
      console.log({ data });

      switch (event) {
        case "signIn":
          setUser(data);
          break;
        case "signOut":
          setUser(null);
          break;
        case "customOAuthState":
          setCustomState(data);
      }
    });

    Auth.currentAuthenticatedUser()
      .then((user) => {
        console.log(user);
        setUser(user);
      })
      .catch(() => console.log("Not signed in"));
  }, []);

  useEffect(() => {
    console.log({ user });
    console.log({ customState });
  }, [customState, user]);

  return (
    <div className="App">
      <p>User: {user ? "ログイン成功" : "None"}</p>
      {user ? (
        // amplifyのサインアウト機能
        <button onClick={() => Auth.signOut()}>Sign Out</button>
      ) : (
        <button
          onClick={() =>
            Auth.federatedSignIn({
              provider: CognitoHostedUIIdentityProvider.Google,
            })
          }
        >
          Open Google
        </button>
      )}
    </div>
  );
};

export default App;
