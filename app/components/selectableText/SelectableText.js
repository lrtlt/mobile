import React from 'react';
import { Linking } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import qs from 'qs';
import { SelectableText } from '@astrocoders/react-native-selectable-text';

/**
 * TODO: find working solution
 * iOS does not support selectable text out of the box.
 */

const EVENT_COPY = 'Kopijuoti';
const EVENT_REPORT = 'Pranešti apie klaidą';

const REPORT_EMAIL = 'portalas@lrt.lt';
const REPORT_EMAIL_SUBJECT = 'Klaida tekste';

const component = props => {
  return (
    <SelectableText
      {...props}
      textBreakStrategy="simple"
      menuItems={[EVENT_COPY, EVENT_REPORT]}
      onSelection={({ eventType, content, selectionStart, selectionEnd }) => {
        switch (eventType) {
          case EVENT_COPY: {
            Clipboard.setString(content);
            break;
          }
          case EVENT_REPORT: {
            sendEmail(REPORT_EMAIL, REPORT_EMAIL_SUBJECT, content);
            break;
          }
        }
      }}
      value={props.children}
    />
  );
};

export async function sendEmail(to, subject, body, options = {}) {
  const { cc, bcc } = options;

  let url = `mailto:${to}`;

  const query = qs.stringify({
    subject: subject,
    body: body,
    cc: cc,
    bcc: bcc,
  });

  if (query.length) {
    url += `?${query}`;
  }

  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    throw new Error('Provided URL can not be handled');
  }

  return Linking.openURL(url);
}

export default component;
