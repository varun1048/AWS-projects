import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import Base from "./Base.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Quiz from "./quiz.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import { Amplify } from "aws-amplify";

import "@aws-amplify/ui-react/styles.css";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Base />,
  },
  {
    path: "/about",
    element: <div>about</div>,
  },
  {
    path: "/quiz",

    element: <Quiz />,
  },
]);

class ErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <ErrorBoundaryClass>
      <ErrorBoundary fallback={<div>Google API is the problem</div>}>
        <React.StrictMode>
          <QueryClientProvider client={queryClient}>
            <ChakraProvider>
              <RouterProvider router={router} />
            </ChakraProvider>
          </QueryClientProvider>
        </React.StrictMode>
      </ErrorBoundary>
    </ErrorBoundaryClass>
  </>
);

{
  /* <RouterProvider router={router} />; */
}
