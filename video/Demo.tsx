import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Intro } from "./scenes/Intro";
import { Outro } from "./scenes/Outro";
import { DesktopFootageScene } from "./scenes/DesktopFootageScene";
import { MobileFootageScene } from "./scenes/MobileFootageScene";

// Duraciones en frames (30fps), calibradas contra la duración real de
// cada clip grabado con `npm run footage`. Si vuelves a grabar el
// material y las duraciones cambian, ajusta estos valores acorde
// (ver duración con: ffmpeg -i video/public/footage/<clip>.webm).
// EXPLORE/RESPONSES/MOBILE recortan sus primeros frames (startFrom) porque
// cada clip arranca con su propio "quickLoad" (pantalla de carga) antes de
// la acción real; sin el recorte se repetiría brevemente la pantalla de
// carga que ya se mostró en la escena 01.
const FOOTAGE_TRIM = 25;

export const INTRO = 150; // 5.0s
export const LOADER = 159; // 5.3s (clip: 5.52s)
export const EXPLORE = 380; // 12.7s (clip: 13.56s, startFrom 25)
export const RESPONSES = 290; // 9.7s (clip: 10.52s, startFrom 25)
export const MOBILE = 225; // 7.5s (clip: 8.36s, startFrom 25)
export const OUTRO = 210; // 7.0s
export const TRANSITION = 20; // ~0.67s, fade entre escenas

export const TOTAL_DURATION =
  INTRO + LOADER + EXPLORE + RESPONSES + MOBILE + OUTRO - TRANSITION * 5;

const transition = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: TRANSITION })}
  />
);

export const Demo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={INTRO}>
        <Intro />
      </TransitionSeries.Sequence>
      {transition}

      <TransitionSeries.Sequence durationInFrames={LOADER}>
        <DesktopFootageScene
          src="footage/desktop-loader.mp4"
          index="01"
          title="Carga cualquier OpenAPI JSON"
          durationInFrames={LOADER}
        />
      </TransitionSeries.Sequence>
      {transition}

      <TransitionSeries.Sequence durationInFrames={EXPLORE}>
        <DesktopFootageScene
          src="footage/desktop-explore.mp4"
          index="02"
          title="Explora endpoints por tag"
          durationInFrames={EXPLORE}
          startFrom={FOOTAGE_TRIM}
        />
      </TransitionSeries.Sequence>
      {transition}

      <TransitionSeries.Sequence durationInFrames={RESPONSES}>
        <DesktopFootageScene
          src="footage/desktop-responses.mp4"
          index="03"
          title="Respuestas con syntax highlight"
          durationInFrames={RESPONSES}
          startFrom={FOOTAGE_TRIM}
        />
      </TransitionSeries.Sequence>
      {transition}

      <TransitionSeries.Sequence durationInFrames={MOBILE}>
        <MobileFootageScene
          src="footage/mobile-flow.mp4"
          index="04"
          title="100% responsive"
          durationInFrames={MOBILE}
          startFrom={FOOTAGE_TRIM}
        />
      </TransitionSeries.Sequence>
      {transition}

      <TransitionSeries.Sequence durationInFrames={OUTRO}>
        <Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
