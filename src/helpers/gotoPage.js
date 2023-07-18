import eventBus from '@/eventBus';

export default function gotoPage(pageName, pageParams) { // создаем метод, объявляем два аргумента
  eventBus.$emit('gotoPage', pageName, pageParams); // отправить событие в глобальную шину событий
}
