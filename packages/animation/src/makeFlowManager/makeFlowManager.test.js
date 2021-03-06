/* eslint-env jest */

import { makeFlowManager } from './makeFlowManager';
import { TYPE_STREAM } from '../constants';

describe('checkMount()', () => {
  test('Should subscribe to parent node if it is a stream and animated', () => {
    const isAnimate = jest.fn(() => true);
    const isActivated = jest.fn(() => true);
    const isOutsourced = jest.fn(() => true);
    const _subscribe = jest.fn();
    const component = {
      props: { parentEnergyContext: { type: TYPE_STREAM, _subscribe } },
      isAnimate,
      isActivated,
      isOutsourced
    };
    const flowManager = makeFlowManager(component);

    flowManager.checkMount();
    expect(_subscribe).toHaveBeenCalledWith(component);
  });

  test('Should do nothing if not animated', () => {
    const isAnimate = jest.fn(() => false);
    const isActivated = jest.fn(() => true);
    const isOutsourced = jest.fn(() => false);
    const enter = jest.fn();
    const component = { props: {}, isAnimate, isActivated, isOutsourced, enter };
    const flowManager = makeFlowManager(component);

    flowManager.checkMount();
    expect(enter).not.toHaveBeenCalled();
  });

  test('Should do nothing if outsourced', () => {
    const isAnimate = jest.fn(() => true);
    const isActivated = jest.fn(() => true);
    const isOutsourced = jest.fn(() => true);
    const enter = jest.fn();
    const component = { props: {}, isAnimate, isActivated, isOutsourced, enter };
    const flowManager = makeFlowManager(component);

    flowManager.checkMount();
    expect(enter).not.toHaveBeenCalled();
  });

  test('Should enter() if animated and activated', () => {
    const isAnimate = jest.fn(() => true);
    const isActivated = jest.fn(() => true);
    const isOutsourced = jest.fn(() => false);
    const enter = jest.fn();
    const component = { props: {}, isAnimate, isActivated, isOutsourced, enter };
    const flowManager = makeFlowManager(component);

    flowManager.checkMount();
    expect(enter).toHaveBeenCalledTimes(1);
  });
});

describe('checkUpdate()', () => {
  test('Should enter() if animated and activated', () => {
    const enter = jest.fn();
    const exit = jest.fn();
    const component = {
      props: {},
      isAnimate: jest.fn(() => true),
      isActivated: jest.fn(() => true),
      isOutsourced: jest.fn(() => false),
      enter,
      exit
    };
    const flowManager = makeFlowManager(component);

    flowManager.checkUpdate();
    expect(enter).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledTimes(0);
  });

  test('Should exit() if entered and updated', () => {
    const enter = jest.fn();
    const exit = jest.fn();
    const component = {
      props: {},
      isAnimate: jest.fn(() => true),
      isActivated: jest.fn(() => true),
      isOutsourced: jest.fn(() => false),
      enter,
      exit
    };
    const flowManager = makeFlowManager(component);

    flowManager.checkUpdate();
    component.isActivated = jest.fn(() => false);
    flowManager.checkUpdate();
    expect(enter).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledTimes(1);
  });

  test('Should do nothing if outsourced', () => {
    const enter = jest.fn();
    const exit = jest.fn();
    const component = {
      props: { imperative: true },
      isAnimate: jest.fn(() => true),
      isActivated: jest.fn(() => true),
      isOutsourced: jest.fn(() => true),
      enter,
      exit
    };
    const flowManager = makeFlowManager(component);

    flowManager.checkUpdate();
    expect(enter).not.toHaveBeenCalled();
    expect(exit).not.toHaveBeenCalled();
  });
});

describe('checkUnmount()', () => {
  test('Should unsubscribe if parent node is stream and animated', () => {
    const isAnimate = jest.fn(() => true);
    const _unsubscribe = jest.fn();
    const component = {
      props: { parentEnergyContext: { type: TYPE_STREAM, _unsubscribe } },
      isAnimate
    };
    const flowManager = makeFlowManager(component);

    flowManager.checkUnmount();
    expect(_unsubscribe).toHaveBeenCalledWith(component);
  });
});
