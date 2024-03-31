import CFoms from "./CFoms";
import { Authenticator } from "@aws-amplify/ui-react";
export default function quiz() {
  return (
    <div style={{ marginTop: "10%" }}>
      <Authenticator>
        {() => (
          <main>
            <CFoms />
          </main>
        )}
      </Authenticator>
    </div>
  );
}
