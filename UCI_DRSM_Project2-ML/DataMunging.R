library(dplyr)
library(languageR)
library(data.table)

#read in data
jobs_data <- read.csv(file = file.choose())
zip_data <- read.csv(file=file.choose())


#create a variable to join our data with geospatial data. best match is to use
#city state since zips arent reliable/missing
jobs_data$citystate <- paste(jobs_data$City,jobs_data$State, sep = ",")

zip_data$citystate <- paste(zip_data$city_ascii,zip_data$state_id,sep = ",")
zip_data$CItyState <- NULL

data_combined <- dplyr::left_join(jobs_data,zip_data,"citystate")
data_combined <- dplyr::select(data_combined,AvgSalary, City, Company, Designation,lat,lng,
                        Max.Salary,Min.Salary,Source,State,Title)
summary(data_combined)
data_combined$Source <- dplyr::if_else(data_combined$Source != 'Glassdoor','Indeed','Glassdoor')
data_combined$Title <- dplyr::if_else(is.na(data_combined$Title) ,'Indeed','Glassdoor')
data_combined$Source <- as.factor(data_combined$Source)

data_combined$position <- tolower(data_combined$position)
data_combined$position_cat <- as.factor(ifelse(data_combined$position %like% 'manager','Data Manager',
                                      ifelse(data_combined$position %like% 'analyst','Data Analyst',         
                                      ifelse(data_combined$position %like% 'director','Data Director',  
                                      ifelse(data_combined$position %like% 'consult','Data Consultant',        
                                      ifelse(data_combined$position %like% 'scien','Data Scientist',
                                      ifelse(data_combined$position %like% 'research','Research Analyst/Scientist',
                                      ifelse(data_combined$position %like% 'dev' | data_combined$position %like% 'program','Data Developer',
                                      ifelse(data_combined$position %like% 'tech','Data Technician',  
                                      
                                      ifelse(data_combined$position %like% 'engine','Data Engineer',
                                      ifelse(data_combined$position %like% 'intell' | data_combined$position %like% 'Business' ,'BI Analyst',
                                      ifelse(data_combined$position %like% 'assist','Data Assistant',
                                      ifelse(data_combined$position %like% 'full','Full Stack Engineer',
                                      ifelse(data_combined$position %like% 'machine','Machine Learning Engineer',
                                      ifelse(data_combined$position %like% 'admin','Data Admin',
                                      ifelse(data_combined$position %like% 'stat','Statistician','Other'))))))))))))))))
summary(data_combined$position_cat)

summary(data_combined)
#write to csv
write.csv(data_combined,'data_jobs.csv')
