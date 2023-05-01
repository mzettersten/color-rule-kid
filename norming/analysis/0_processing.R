library(tidyverse)
library(ggplot2)
library(here)
library(jsonlite)
library(janitor)
source(here("helper_functions.R"))
data_path <- here("..","data")
processed_data_path <- here(data_path,"processed_data")

#### processing functions ####
process_ckn_norming_data <- function(data_type,data_path,processed_data_path,file_name) {
  raw_data_path <- here(data_path,"raw_data",data_type)
  #read in experimental data
  exp_data <- read_and_combine_data(raw_data_path,column_types = cols(.default = "c"))
  #filter out relevant responses
  processed_data <- exp_data %>%
    filter(trial_kind=="response") 
  #fix participant naming
  processed_data <- processed_data %>%
    mutate(old_subject_id=subject_id) %>%
    mutate(subject_id = case_when(
      str_detect(file_path,"CKN_108_FINAL_SESSION_2023-03-07_09h33.29.210") ~ "CKN_108a",
      str_detect(file_path,"CKN_108_FINAL_SESSION_2023-03-07_09h40.15.939") ~ "CKN_108b",
      str_detect(file_path,"CKN_114_FINAL_SESSION_2023-03-09_08h38.29.493") ~ "CKN_114a",
      str_detect(file_path,"CKN_114_FINAL_SESSION_2023-03-09_08h53.03.472") ~ "CKN_114b",
      TRUE ~ subject_id
    ))
  #write data
  write_csv(processed_data,here(processed_data_path,file_name))
  return(processed_data)
}

processed_kid_data <- process_ckn_norming_data("kids",data_path,processed_data_path,"ckn_v1_processed.csv")
processed_adult_data <- process_ckn_norming_data("adults",data_path,processed_data_path,"can_v1_processed.csv")

