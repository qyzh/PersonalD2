import React from "react";
interface SHeaderProps {
  header: string;
  desc: string;
}
export default function SHeader(props: SHeaderProps) {
    return (
      <div className="py-6">
        <h1 className="text-4xl font-bold">{props.header}</h1>
        <p className="text-zinc-500 font-mono">{props.desc}</p>
      </div>
    );
  }
