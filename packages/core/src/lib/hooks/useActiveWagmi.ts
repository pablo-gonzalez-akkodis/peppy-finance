import { useRef } from "react";
import useWagmi from "./useWagmi";

export default function useActiveWagmi() {
  const context = useWagmi();
  const activeContextRef = useRef(context);
  activeContextRef.current = context;

  return activeContextRef.current;
}
