function getNoteByPunkte(i)
{
 if(i <= 300)
        {
                return "4.0";
        } else if((i >= 301) && (i <= 318)) {
                return "3.9";
        } else if((i >= 319) && (i <= 336)) {
                return "3.8";
        } else if((i >= 337) && (i <= 354)) {
                return "3.7";
        } else if((i >= 355) && (i <= 372)) {
                return "3.6";
        } else if((i >= 373) && (i <= 390)) {
                return "3.5";
        } else if((i >= 391) && (i <= 408)) {
                return "3.4";
        } else if((i >= 409) && (i <= 426)) {
                return "3.3";
        } else if((i >= 427) && (i <= 444)) {
                return "3.2";
        } else if((i >= 445) && (i <= 462)) {
                return "3.1";
        } else if((i >= 463) && (i <= 480)) {
                return "3.0";
        } else if((i >= 481) && (i <= 498)) {
                return "2.9";
        } else if((i >= 499) && (i <= 516)) {
                return "2.8";
        } else if((i >= 517) && (i <= 534)) {
                return "2.7";
        } else if((i >= 535) && (i <= 552)) {
                return "2.6";
        } else if((i >= 553) && (i <= 570)) {
                return "2.5";
        } else if((i >= 571) && (i <= 588)) {
                return "2.4";
        } else if((i >= 589) && (i <= 606)) {
                return "2.3";
        } else if((i >= 607) && (i <= 624)) {
                return "2.2";
        } else if((i >= 625) && (i <= 642)) {
                return "2.1";
        } else if((i >= 643) && (i <= 660)) {
                return "2.0";
        } else if((i >= 661) && (i <= 678)) {
                return "1.9";
        } else if((i >= 679) && (i <= 696)) {
                return "1.8";
        } else if((i >= 714) && (i <= 714)) {
                return "1.7";
        } else if((i >= 715) && (i <= 732)) {
                return "1.6";
        } else if((i >= 733) && (i <= 750)) {
                return "1.5";
        } else if((i >= 751) && (i <= 768)) {
                return "1.4";
        } else if((i >= 769) && (i <= 786)) {
                return "1.3";
        } else if((i >= 787) && (i <= 804)) {
                return "1.2";
        } else if((i >= 805) && (i <= 822)) {
                return "1.1";
        } else if((i >= 823) && (i <= 900)) {
                return "1.0";
        } else {
            return false;
        }
}