import Head from '@docusaurus/Head';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function GlossaryAnchorScript() {
  return (
    <Head>
      <script type="text/javascript" src={useBaseUrl('scripts/anchorScript.js')}></script>
    </Head>
  );
}