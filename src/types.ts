/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ValuationHistory {
  year: string;
  val: string;
}

export interface Asset {
  id: string;
  name: string;
  specs: string;
  price: string;
  img: string; // Unsplash photo ID
  fullSpecs: string[];
  history: ValuationHistory[];
}

export interface Message {
  id: string;
  role: "user" | "model";
  text: string;
}

export interface ShopifyTemplate {
  name: string;
  label: string;
  code: string;
  instructions: string;
}
