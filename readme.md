hand media pipe landmark demo

## Qualità del rilevamento (`qualita.html`)

Pagina per valutare quanto bene MediaPipe rileva mano, gamba e piede in condizioni diverse (luce, distanza, obiettivo, fps). Usa la stessa libreria locale in `mp/`.

- **Setup:** parte del corpo (mano, gamba, piede), camera, obiettivo (anche ultra grandangolo, se il browser lo espone), fps richiesti (30/60), modello pose (lite/full/heavy), media mobile (1-3 frame, esclusi i frame sotto soglia), soglia di confidenza.
- **Piede:** un solo piede alla volta, quello in primo piano nella ripresa laterale. In automatico segue il piede con la confidenza più alta.
- **Pose Landmarker** ha bisogno di vedere tutto il corpo: inquadrando solo dall'anca in giù non trova la persona.
- **Misura 10 s:** con un'etichetta della condizione, calcola per ogni punto la % di frame rilevati, la confidenza media e il tremolio (spostamento mediano e P90 tra frame consecutivi, in % di tallone-punta, ginocchio-caviglia o polso-base del medio). Esporta un CSV con impostazioni, riepilogo e dati per frame.

Per usarla offline, scarica i modelli in `mp/` (oltre a `hand_landmarker.task`):

```sh
for m in lite full heavy; do
  curl -L -o mp/pose_landmarker_$m.task \
    https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_$m/float16/1/pose_landmarker_$m.task
done
```
