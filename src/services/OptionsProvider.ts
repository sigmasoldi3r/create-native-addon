import { Service } from 'typedi'

/**
 * This service is in charge of selecting the appropriate
 * input method for project options, in each case.
 *
 * Cases where interactive input will be totally discarded:
 * If the environment is not interactive (In this case, you
 * must provide ALL options via flags and such).
 * If the flag --no-prompt is provided.
 */
@Service()
export default class OptionsProvider {}
