import LaunchTerminal from "../../component/page";

export default function Page() {
  const serverNow = new Date().toISOString();

  return(
      <LaunchTerminal serverNow={serverNow}/>
  )
}