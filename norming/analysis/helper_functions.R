#### processing functions ####
read_and_combine_data <- function(data_path, column_types=NULL, file_ext = ".csv") {
  filepaths <- list.files(data_path, full.names = TRUE, pattern = file_ext)
  full_dataset <- map(filepaths, ~{read_csv(.x,col_types = column_types,id="file_path")}) %>% 
    bind_rows()
  full_dataset
}