/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// A secure, lightweight fallback mock for formdata-polyfill in iframe environments
const FormDataMock = typeof window !== 'undefined' && window.FormData ? window.FormData : class {};

export const formDataToBlob = (fd: any) => {
  return new Blob();
};

export { FormDataMock as FormData };
export default FormDataMock;
