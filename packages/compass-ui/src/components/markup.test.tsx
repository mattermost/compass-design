import { describe, expect, it } from 'vitest';
import { render } from '@/test-utils/render';
import ActionButton from './ActionButton/ActionButton';
import Button from './Button/Button';
import CardButton from './CardButton/CardButton';
import Combobox from './Combobox/Combobox';
import Checkbox from './Checkbox/Checkbox';
import IconButton from './IconButton/IconButton';
import MenuItem from './MenuItem/MenuItem';
import Radio from './Radio/Radio';
import Switch from './Switch/Switch';

function html(ui: React.ReactElement) {
  return render(ui).container.innerHTML;
}

/** Snapshots were recorded against the pre-forwardRef components. */
describe('default markup is unchanged', () => {
  it('Button as used by the webapp ConfirmModal', () => {
    expect(
      html(
        <Button
          emphasis="primary"
          destructive
          id="confirmModalButton"
          // eslint-disable-next-line jsx-a11y/no-autofocus -- mirrors the webapp ConfirmModal call site
          autoFocus
          onClick={() => {}}
        >
          Delete
        </Button>,
      ),
    ).toMatchInlineSnapshot(
      `"<button class="_button_ee73f7 _button--emphasis-primary_ee73f7 _button--size-medium_ee73f7 _button--destructive_ee73f7" type="button" id="confirmModalButton"><span class="_button__label_ee73f7">Delete</span></button>"`,
    );
  });

  it('Button secondary', () => {
    expect(
      html(<Button emphasis="secondary">Cancel</Button>),
    ).toMatchInlineSnapshot(
      `"<button class="_button_ee73f7 _button--emphasis-secondary_ee73f7 _button--size-medium_ee73f7" type="button"><span class="_button__label_ee73f7">Cancel</span></button>"`,
    );
  });

  it('IconButton', () => {
    expect(
      html(<IconButton icon={null} aria-label="Close" toggled={false} />),
    ).toMatchInlineSnapshot(
      `"<button class="_icon-button_7eff5b _icon-button--size-medium_7eff5b" type="button" aria-label="Close" aria-pressed="false"><span class="_icon-button__icon-slot_7eff5b" aria-hidden="true"></span></button>"`,
    );
  });

  it('ActionButton', () => {
    expect(
      html(<ActionButton icon={null} label="Call" />),
    ).toMatchInlineSnapshot(
      `"<button class="_action-button_a2861e" type="button"><span class="_action-button__icon_a2861e" aria-hidden="true"></span><span class="_action-button__label_a2861e">Call</span></button>"`,
    );
  });

  it('CardButton', () => {
    expect(
      html(<CardButton icon={null} title="Public" selected />),
    ).toMatchInlineSnapshot(
      `"<button type="button" class="_card-button_301b7e _card-button--selected_301b7e" aria-pressed="true"><span class="_card-button__icon_301b7e" aria-hidden="true"></span><span class="_card-button__text_301b7e"><span class="_card-button__title_301b7e">Public</span></span><span class="_card-button__check_301b7e" aria-hidden="true"><div class="_icon_596ab4 _icon--size-20_596ab4" aria-hidden="true"><div class="_icon__glyph-area_596ab4"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2C6.477,2,2,6.477,2,12s4.477,10,10,10s10-4.477,10-10S17.523,2,12,2z M10.243,16.693L10.243,16.693l-1.415-1.415L6,12.45l1.414-1.414l2.828,2.828L16.607,7.5l1.415,1.415L10.243,16.693z"></path></svg></div></div></span></button>"`,
    );
  });

  it('MenuItem', () => {
    expect(html(<MenuItem label="Edit" />)).toMatchInlineSnapshot(
      `"<button class="_menu-item_745a38" type="button"><div class="_menu-item__content_745a38"><div class="_menu-item__left_745a38"><span class="_menu-item__leading-visual_745a38" aria-hidden="true"><div class="_icon_596ab4 _icon--size-16_596ab4" aria-hidden="true"><div class="_icon__glyph-area_596ab4"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z"></path></svg></div></div></span></div><div class="_menu-item__middle_745a38"><div class="_menu-item__top-row_745a38"><span class="_menu-item__label_745a38">Edit</span></div></div></div></button>"`,
    );
  });

  it('Checkbox', () => {
    expect(
      html(
        <Checkbox id="c" defaultChecked>
          Label
        </Checkbox>,
      ),
    ).toMatchInlineSnapshot(
      `"<label class="_checkbox_cd53e0 _checkbox--size-medium_cd53e0" for="c"><input id="c" class="_checkbox__input_cd53e0" type="checkbox" checked=""><span class="_checkbox__box_cd53e0"><span class="_checkbox__icon_cd53e0"><div class="_icon_596ab4 _icon--size-12_596ab4" aria-hidden="true"><div class="_icon__glyph-area_596ab4"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"></path></svg></div></div></span></span><span class="_checkbox__label_cd53e0">Label</span></label>"`,
    );
  });

  it('Radio', () => {
    expect(
      html(
        <Radio id="r" name="g">
          Label
        </Radio>,
      ),
    ).toMatchInlineSnapshot(
      `"<label class="_radio_31042b _radio--size-medium_31042b" for="r"><input id="r" class="_radio__input_31042b" type="radio" name="g"><span class="_radio__circle_31042b"><span class="_radio__dot_31042b" aria-hidden="true"></span></span><span class="_radio__label_31042b">Label</span></label>"`,
    );
  });

  it('Switch', () => {
    expect(
      html(
        <Switch id="s" defaultChecked>
          Label
        </Switch>,
      ),
    ).toMatchInlineSnapshot(
      `"<label class="_switch_ba4e81 _switch--size-medium_ba4e81" for="s"><span class="_switch__labels_ba4e81"><span class="_switch__label_ba4e81">Label</span></span><span class="_switch__track_ba4e81"><input id="s" role="switch" class="_switch__input_ba4e81" aria-checked="true" type="checkbox" checked=""><span class="_switch__knob_ba4e81" aria-hidden="true"></span></span></label>"`,
    );
  });

  it('Combobox single', () => {
    expect(
      html(
        <Combobox
          id="cb"
          label="Channel"
          defaultValue="design"
          options={[
            { value: 'design', label: 'Design' },
            { value: 'releases', label: 'Releases' },
          ]}
        />,
      ),
    ).toMatchInlineSnapshot(
      `"<div class="_combobox_70f7ac _combobox--size-medium_70f7ac _combobox--label-floated_70f7ac"><div class="_combobox__wrapper_70f7ac"><label class="_combobox__label_70f7ac" for="cb">Channel</label><div class="_combobox__inner_70f7ac"><div class="_combobox__value_70f7ac"><input id="cb" class="_combobox__control_70f7ac" role="combobox" autocomplete="off" spellcheck="false" aria-expanded="false" aria-controls="cb-listbox" aria-autocomplete="list" type="text" value="Design"></div><span class="_combobox__trailing-icon_70f7ac" aria-hidden="true"><div class="_icon_596ab4 _icon--size-12_596ab4" aria-hidden="true"><div class="_icon__glyph-area_596ab4"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"></path></svg></div></div></span></div></div></div>"`,
    );
  });

  it('Combobox multiple', () => {
    expect(
      html(
        <Combobox
          id="cbm"
          label="People"
          multiple
          value={['b', 'a', 'missing']}
          options={[
            { value: 'a', label: 'Alice' },
            { value: 'b', label: 'Bob' },
          ]}
        />,
      ),
    ).toMatchInlineSnapshot(
      `"<div class="_combobox_70f7ac _combobox--size-medium_70f7ac _combobox--label-floated_70f7ac _combobox--has-chips_70f7ac"><div class="_combobox__wrapper_70f7ac"><label class="_combobox__label_70f7ac" for="cbm">People</label><div class="_combobox__inner_70f7ac"><div class="_combobox__value_70f7ac"><div aria-label="People selections" class="_chip-group_0aa38f" role="toolbar" aria-orientation="horizontal"><div class="_chip_db480f _chip--size-medium_db480f" role="button" tabindex="0" aria-label="Alice. Press Delete to remove." data-chip=""><span class="_chip__label_db480f">Alice</span><button type="button" class="_chip__remove_db480f" data-chip-remove="" tabindex="-1" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="12" height="12" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"></path></svg></button></div><div class="_chip_db480f _chip--size-medium_db480f" role="button" tabindex="-1" aria-label="Bob. Press Delete to remove." data-chip=""><span class="_chip__label_db480f">Bob</span><button type="button" class="_chip__remove_db480f" data-chip-remove="" tabindex="-1" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="12" height="12" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"></path></svg></button></div></div><input id="cbm" class="_combobox__control_70f7ac" role="combobox" autocomplete="off" spellcheck="false" aria-expanded="false" aria-controls="cbm-listbox" aria-autocomplete="list" type="text" value=""></div><span class="_combobox__trailing-icon_70f7ac" aria-hidden="true"><div class="_icon_596ab4 _icon--size-12_596ab4" aria-hidden="true"><div class="_icon__glyph-area_596ab4"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"></path></svg></div></div></span></div></div></div>"`,
    );
  });
});
