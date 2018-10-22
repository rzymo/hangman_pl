var pswd_list = [""];
var covered = "";
var len  = 0;
var pass = "";
var alphabet = "AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ";
var content  = "";
var miss = 0;
var pts_ok = 0;
var pts_no = 0;
var sounds = {
  ok: new Audio("./media/ok.wav"),
  no: new Audio("./media/no.wav")
};

fetch('./media/text.txt')
  .then((resp) => resp.text().then(init));

function init(x)
{
  pswd_list = x.split("\n");
  start();
}

function print_pass()
{
  document.getElementById("password").innerHTML = covered;
}

function pts()
{
  var txt = '<span style="color: green;">'+pts_ok+'</span>';
      txt += ' <span style="color: red;">'+pts_no+'</span>';
  document.getElementById("pts").innerHTML = txt;
}

function start()
{
  content = "";
  covered = "";
  miss    = 0;

  document.getElementById("gallows").innerHTML = '<img src="./media/img0.jpg"; alt="" />';

  var which = Math.floor(Math.random() * (pswd_list.length-1)); // ma byc -1
  pass = pswd_list[which].toString().toUpperCase();
  len  = pass.length;                           // nie ma nawiasow, bo to wlasciwosc, a nie funkcja

  for (i = 0; i < len; i++)
  {
    if (pass.charAt(i) == " ") covered += " ";
    else covered += "-" ;
  }

  for (i = 0; i < 35; i++)
  {
    var elem = "lit" + i;
    content += '<div class="letter" onclick="check('+i+')" id="'+elem+'">' + alphabet.charAt(i) + '</div>';
    if ((i+1) % 7 == 0) content += '<div style="clear:both;"></div>';
  }

  document.getElementById("letters").innerHTML = content;
  print_pass();
  pts();
}

String.prototype.setChar = function(where, char)
{
  if (where > this.length - 1) return this.toString(); // dla pewnosci
  else return this.substr(0, where) + char + this.substr(where+1);
}

function check(num)
{
  var hit = false;
  for (i = 0; i < len; i++)
  {
    if (pass.charAt(i) == alphabet.charAt(num))
    {
      covered = covered.setChar(i, alphabet.charAt(num));
      hit = true;
    }
  }

  get_elem = document.getElementById("lit"+num);
  if (hit == true)
  {
    sounds.ok.play();
    get_elem.style.background = "#003300";
    get_elem.style.color  = "#00C000";
    get_elem.style.border = "2px solid #00C000";
    get_elem.style.cursor = "default";
    print_pass();
  }
  else
  {
    sounds.no.play();
    get_elem.style.background = "#330000";
    get_elem.style.color  = "#C00000";
    get_elem.style.border = "2px solid #C00000";
    get_elem.style.cursor = "default";
    get_elem.setAttribute("onclick",";"); // brak klikalnosci

    miss++;
    var image = "./media/img"+miss+".jpg";
    document.getElementById("gallows").innerHTML = "<img src="+image+" alt='' />";
  }

  if (pass == covered)
  {
    pts_ok++;
    pts();
    document.getElementById("letters").innerHTML = '<br/><br/>Dobre hasło!<br/><br/> <span class="reset" onclick="start()">dalej &rarr;</span>';
  }

  if (miss >= 8)
  {
    pts_no++;
    pts();
    document.getElementById("letters").innerHTML = '<br/><br/>Uuuuu!<br/><br/> <span class="reset" onclick="start()">dalej &rarr;</span>';
  }
}
