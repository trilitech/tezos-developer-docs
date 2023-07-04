import React from 'react';
import { InlineWidget } from 'react-calendly';

export default function CalendlyEmbed() {
  const url = 'https://calendly.com/developer-success-on-tezos';

  return (
    <div>
      <InlineWidget url={url} />
    </div>
  );
}

// export default function CalendlyEmbed() {
//     const url = 'https://calendly.com/developer-success-on-tezos';
  
//     return (
//       <div className="-mt-14">
//         <InlineWidget url={url} />
//       </div>
//     );
//   }
  