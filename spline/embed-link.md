# embeds

## SplineViewer

```bash
<iframe src='https://my.spline.design/particleplanet-FkRqqAwsVN6ElGigH3HvtMtD/' frameborder='0' width='100%' height='100%'></iframe>
```

## integrated embeded code:

```bash
<script type="module" src="https://unpkg.com/@splinetool/viewer@1.10.39/build/spline-viewer.js"></script>
<spline-viewer url="https://prod.spline.design/DNj4ME98pq5OHLLH/scene.splinecode"></spline-viewer>
```

## Code Export

```bash
import Spline from '@splinetool/react-spline/next';

export default function Home() {
  return (
    <main>
      <Spline
        scene="https://prod.spline.design/DNj4ME98pq5OHLLH/scene.splinecode" 
      />
    </main>
  );
}
```

