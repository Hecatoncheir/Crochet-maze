library page_view_component;

import 'package:angular2/core.dart';

import 'package:crochet_maze/components/gophers/gophers.dart';

@Component(
    selector: 'page-view',
    templateUrl: "page_view.html",
    directives: const [GophersComponent])
class PageViewComponent {}
