import './assertions/match-schema';
import './commands/api.commands';
import './commands/ui.commands';
import { executarExclusoesAgendadas } from './commands/limpeza.commands';

afterEach(() => {
  executarExclusoesAgendadas();
});
