"use client";

import "7.css/dist/7.scoped.css";
import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";

export interface Win7DialogHandle {
    show: () => void;
    close: () => void;
}

const Win7Dialog = forwardRef<
    Win7DialogHandle,
    { children: React.ReactNode; title?: string; barColor?: string }
>(({ children, title, barColor }, ref) => {
    const win7DialogRef = useRef<HTMLDialogElement>(null);
    const titleBarRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);

    const barColorVar = barColor ? {
        '--w7-w-bg': barColor
    } : {}

    const normWinStyles = {
        width: "250px",
        display: "flex",
        flexDirection: "column",
    }

    const combinedStyle = {...normWinStyles, ...barColorVar}

    const [maximized, setMaximized] = useState<boolean>(false);
    const [loc, setLoc] = useState<{ x: string; y: string }>({
        x: "0px",
        y: "0px",
    });

    function closeDialog() {
        win7DialogRef.current?.close();
    }

    function showDialog() {
        win7DialogRef.current?.show();
    }

    useImperativeHandle(ref, () => ({
        show: showDialog,
        close: closeDialog,
    }));

    useEffect(() => {
        const dialogEl = win7DialogRef.current;
        const titleBarEl = titleBarRef.current;
        if (!dialogEl || !titleBarEl) return;

        dialogEl.style.position = "fixed";
        dialogEl.style.left = "calc(50vw - 124px)";
        dialogEl.style.top = "calc(50vh - 44px)";

        let offsetX = 0,
            offsetY = 0;
        let dragging = false;

        const startDrag = (e: MouseEvent) => {
            e.preventDefault();
            dragging = true;
            dialogEl.classList.remove(
                "top-1/2",
                "left-1/2",
                "translate-x-[-50%]",
                "translate-y-[-50%]",
            );
            const rect = dialogEl.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            dialogEl.style.left = rect.left + "px";
            dialogEl.style.top = rect.top + "px";
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", stopDrag);
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!dragging) return;
            e.preventDefault();
            dialogEl.style.left = e.clientX - offsetX + "px";
            // eslint-disable-next-line
            if ((dialogEl.style.left.replace("px", "") as any as number) < 0) {
                dialogEl.style.left = "0px";
            }
            if (
                // eslint-disable-next-line
                (dialogEl.style.left.replace("px", "") as any as number) >
                window.innerWidth - 250
            ) {
                dialogEl.style.left = `${window.innerWidth - 250}px`;
            }
            dialogEl.style.top = e.clientY - offsetY + "px";
            if (
                // eslint-disable-next-line
                (dialogEl.style.top.replace("px", "") as any as number) >
                window.innerHeight - 88
            ) {
                dialogEl.style.top = `${window.innerHeight - 88}px`;
            }
            // eslint-disable-next-line
            if ((dialogEl.style.top.replace("px", "") as any as number) < 0) {
                dialogEl.style.top = "0px";
            }
            setLoc({ x: dialogEl.style.left, y: dialogEl.style.top });
        };

        const stopDrag = () => {
            dragging = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", stopDrag);
        };

        titleBarEl.onmousedown = startDrag;

        return () => {
            titleBarEl.onmousedown = null;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", stopDrag);
        };
    }, []);

    return (
        <dialog
            open
            className="win7"
            style={{
                zIndex: 999999,
                color: "black",
                backgroundColor: "#0000"
            }}
            id="win7Dialog"
            ref={win7DialogRef}
        >
            <div
                className="window glass active"
                style={combinedStyle as React.CSSProperties}
                ref={windowRef}
            >
                <div 
                    className="title-bar select-none" 
                    style={{
                        WebkitUserSelect: "none",
                        MozUserSelect: "none",
                        userSelect: "none"
                    }}
                    ref={titleBarRef}
                >
                    <div className="title-bar-text">{title || "Dialog"}</div>
                    <div className="title-bar-controls">
                        <button
                            aria-label="Minimize"
                            onClick={closeDialog}
                        />
                        {!maximized && (
                            <button
                                aria-label="Maximize"
                                onClick={() => {
                                    setMaximized(true);
                                    if (
                                        windowRef.current &&
                                        win7DialogRef.current
                                    ) {
                                        win7DialogRef.current.style.width =
                                            "100vw";
                                        win7DialogRef.current.style.height =
                                            "100vh";
                                        windowRef.current.style.width = "100vw";
                                        windowRef.current.style.height =
                                            "100vh";
                                        windowRef.current.style.margin = "0px";
                                        win7DialogRef.current.style.top = "0px";
                                        win7DialogRef.current.style.left =
                                            "0px";
                                        windowRef.current.style.borderRadius =
                                            "0px";
                                    }
                                }}
                            ></button>
                        )}
                        {maximized && (
                            <button
                                aria-label="Restore"
                                onClick={() => {
                                    setMaximized(false);
                                    if (
                                        windowRef.current &&
                                        win7DialogRef.current
                                    ) {
                                        win7DialogRef.current.style.width =
                                            "auto";
                                        win7DialogRef.current.style.height =
                                            "auto";
                                        windowRef.current.style.width = "250px";
                                        windowRef.current.style.height = "auto";
                                        windowRef.current.style.margin = "32px";
                                        win7DialogRef.current.style.top = loc.y;
                                        win7DialogRef.current.style.left =
                                            loc.x;
                                        windowRef.current.style.borderRadius =
                                            "";
                                    }
                                }}
                            ></button>
                        )}
                        <button
                            aria-label="Close"
                            onClick={closeDialog}
                        ></button>
                    </div>
                </div>
                <div
                    style={{
                        WebkitUserSelect: "none",
                        MozUserSelect: "none",
                        userSelect: "none",
                        overflow: "clip",
                        justifyContent: "space-between",
                        flexDirection: "column",
                        height: "100%",
                        display: "flex",
                        boxSizing: "border-box",
                        position: "relative"
                    }}
                >
                    <div
                        style={{
                            WebkitUserSelect: "none",
                            MozUserSelect: "none",
                            userSelect: "none",
                            textAlign: "left"
                        }}
                    >{children}</div>
                    <section
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "flex-end",
                            alignContent: "baseline",
                            position: "relative",
                            gap: "6px",
                            alignSelf: "flex-end",
                        }}
                    >
                        <button className="default" onClick={closeDialog}>
                            OK
                        </button>
                        <button onClick={closeDialog}>Cancel</button>
                    </section>
                </div>
            </div>
        </dialog>
    );
});

Win7Dialog.displayName = "Win7Dialog";

export default Win7Dialog;
