import { describe, expect, it } from 'vitest';
import serializer, {
  stripCompassClassHashes,
  test as isHashed,
} from './snapshot-serializer';

describe('compass snapshot serializer', () => {
  it('strips hash and line from compass class tokens only', () => {
    expect(
      stripCompassClassHashes(
        '_icon-button_13ryy_2 _icon-button--size-small_13ryy_77 _icon-button__icon-slot_ft92e_120 host-class',
      ),
    ).toBe(
      'icon-button icon-button--size-small icon-button__icon-slot host-class',
    );
  });

  it('strips tokens at class attribute boundaries in raw HTML strings', () => {
    const html =
      '<button class="_button_ab12c_3 _button--small_ab12c_40"><span class="_button__label_ab12c_52">Go</span></button>';
    expect(isHashed(html)).toBe(true);
    expect(stripCompassClassHashes(html)).toBe(
      '<button class="button button--small"><span class="button__label">Go</span></button>',
    );
  });

  it('leaves other attributes ending in class untouched', () => {
    expect(
      stripCompassClassHashes(
        '<div data-class="_order_abc12_42" class="_card_abc12_3"></div>',
      ),
    ).toBe('<div data-class="_order_abc12_42" class="card"></div>');
  });

  it('strips authored names that start with an uppercase letter', () => {
    expect(stripCompassClassHashes('_Button_ab12c_3 host')).toBe('Button host');
  });

  it('strips authored names that start with a hyphen', () => {
    expect(stripCompassClassHashes('_-host-shadow-a_1d2d4_38')).toBe(
      '-host-shadow-a',
    );
  });

  it('ignores strings without compass tokens', () => {
    expect(isHashed('host-class other')).toBe(false);
    expect(isHashed('_private_value')).toBe(false);
    expect(isHashed(42)).toBe(false);
  });

  it('is stable across repeated calls (no /g lastIndex state)', () => {
    const value = '_button_ab12c_3';
    expect([isHashed(value), isHashed(value), isHashed(value)]).toEqual([
      true,
      true,
      true,
    ]);
  });

  it('rewrites class attributes in DOM and object snapshots', () => {
    expect.addSnapshotSerializer(serializer);
    const el = document.createElement('button');
    el.className = '_button_ab12c_3 _button--size-small_ab12c_40 host';
    el.innerHTML = '<span class="_button__label_ab12c_52">Go</span>';

    expect(el).toMatchInlineSnapshot(`
      <button
        class="button button--size-small host"
      >
        <span
          class="button__label"
        >
          Go
        </span>
      </button>
    `);
    expect({ className: el.className }).toMatchInlineSnapshot(`
      {
        "className": "button button--size-small host",
      }
    `);
  });
});
