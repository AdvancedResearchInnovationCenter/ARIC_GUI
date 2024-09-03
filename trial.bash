#!/bin/bash

rosclean purge -y

 
gnome-terminal -- /bin/bash  -c 'conda init; source /home/dark/miniconda3/etc/profile.d/conda.sh; conda activate py27;xdg-open gui.html'

xdg-open gui.html

