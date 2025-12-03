import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import { Auth0Provider } from "@auth0/auth0-react";
import { authConfig } from "./authConfig";

import { AuthProvider } from "./component/components/Authetication/Authcontext";
// <-- IMPORTANT: import AuthProvider

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={authConfig.domain}
        clientId={authConfig.clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <AuthProvider>    {/* <-- ADD THIS */}
          <App />
        </AuthProvider>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);





// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";

// import { Auth0Provider } from "@auth0/auth0-react";
// import { authConfig } from "./authConfig";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Auth0Provider
//         domain={authConfig.domain}
//         clientId={authConfig.clientId}
//         authorizationParams={{
//           redirect_uri: window.location.origin,
//         }}
//       >
//         <App />
//       </Auth0Provider>
//     </BrowserRouter>
//   </React.StrictMode>
// );

